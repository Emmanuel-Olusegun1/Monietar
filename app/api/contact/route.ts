import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage as fallback
const contactMessages: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Try to use database if available, otherwise use in-memory storage
    try {
      // Check if we're in development mode and database is available
      if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL) {
        // Dynamic import to avoid build errors
        const { prisma } = await import('@/lib/prisma');
        
        // Create new contact message in database
        const contact = await prisma.contact.create({
          data: { name, email, message },
        });

        return NextResponse.json(
          { message: 'Contact form submitted successfully', contact },
          { status: 201 }
        );
      } else {
        throw new Error('Database not available in current environment');
      }
    } catch (dbError) {
      // Fallback to in-memory storage if database is unavailable
      console.log('Database unavailable, using in-memory storage');
      
      const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        message,
        createdAt: new Date()
      };
      
      contactMessages.push(newMessage);

      return NextResponse.json(
        { message: 'Contact form submitted successfully (in-memory)', contact: newMessage },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  try {
    // Try to use database if available
    try {
      if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL) {
        const { prisma } = await import('@/lib/prisma');
        const contacts = await prisma.contact.findMany({
          orderBy: { createdAt: 'desc' },
        });
        
        return NextResponse.json({
          message: 'Database connected',
          source: 'database',
          count: contacts.length,
          contacts: contacts
        });
      } else {
        throw new Error('Database not available');
      }
    } catch (dbError) {
      // Fallback to in-memory storage
      return NextResponse.json({
        message: 'Using in-memory storage (database unavailable)',
        source: 'memory',
        count: contactMessages.length,
        contacts: contactMessages
      });
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}