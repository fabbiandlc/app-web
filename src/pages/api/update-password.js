import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laptztfdcryylfjorfpl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Store in environment variable
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Correo electrónico y contraseña son requeridos',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Restrict in production
          },
        }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.error('Error checking user:', userError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Correo electrónico no encontrado',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Update user password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error al actualizar la contraseña',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contraseña actualizada con éxito',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    console.error('Error en el procesamiento:', err);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}