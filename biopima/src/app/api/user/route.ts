import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/user/`);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const result = await response.json();
    return NextResponse.json(result, {
      status: 200,
      statusText: 'User created successfully'
    });
  } catch (error) {
    console.error('GET request error:', error);
    return NextResponse.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();
    const {name, email, phone_number, username} = bodyData;
    if (!name || !email || !phone_number || !username) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(`${baseUrl}/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const result = await response.json();
    

    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: 'User created successfully',
    });
  } catch(error){
        return new Response((error as Error).message, {
            status:500,
            statusText: 'Internal server error'
        })
    }
}
