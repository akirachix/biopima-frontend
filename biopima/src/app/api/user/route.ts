import { NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/api/user/`);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const result = await response.json();
    return NextResponse.json(result, { 
      status: 200, 
      statusText: result.message });
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
    const { name, email, phone_number, username } = bodyData;

    if (!name || !email || !phone_number || !username) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(`${baseUrl}/api/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const result = await response.json();

    if (response.status === 409 || response.status === 400) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || 'Failed to create user' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, {
      status: 201,
      statusText: result.message,
    });

  } catch (error) {
    console.error('POST request error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
