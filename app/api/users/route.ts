// app/api/users/route.ts
export async function POST(request: Request) {
    return Response.json({ 
      success: true, 
      message: 'User signup successful' 
    }, { status: 201 });
  }