import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Contact form fallback API called');
    
    const body: ContactFormData = await request.json();
    console.log('Form data received:', { name: body.name, email: body.email, subject: body.subject });
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Save to Supabase inquiries table (same as Edge Function)
    console.log('💾 Storing in Supabase inquiries table...');
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: body.name,
          email: body.email,
          message: `Subject: ${body.subject}\n\n${body.message}`,
          type: 'contact',
          source: 'website_contact_form',
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Success! Inquiry ID:', data.id);
    
    // Note: Vbout integration will be handled separately
    return NextResponse.json({
      success: true,
      inquiryId: data.id,
      message: 'Contact form submitted successfully (via fallback API)'
    });

  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
