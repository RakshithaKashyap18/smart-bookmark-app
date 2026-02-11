import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Exchange Error:', error.message);
      return NextResponse.redirect(`${requestUrl.origin}?error=auth_error_${error.status}`);
    }

    // Success! Ensure the session is set
    const response = NextResponse.redirect(requestUrl.origin);
    
    // Manually ensure cookies are passed to the response
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, { path: '/' });
      response.cookies.set('sb-refresh-token', data.session.refresh_token, { path: '/' });
    }
    
    return response;
  }

  return NextResponse.redirect(requestUrl.origin);
}