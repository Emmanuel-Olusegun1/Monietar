import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Received email:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('Invalid email');
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists using Prisma
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      console.log('Email already exists in database');
      return NextResponse.json(
        { error: 'Email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Create new subscription using Prisma
    const subscription = await prisma.subscription.create({
      data: { email },
    });

    console.log('Added to database:', subscription);

    return NextResponse.json(
      { message: 'Successfully added to waitlist', subscription },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Subscription error:', error);
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email is already on the waitlist' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET method for testing database connection
export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany();
    return NextResponse.json({
      message: 'Subscriptions API - Database Connected',
      count: subscriptions.length,
      subscriptions
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}