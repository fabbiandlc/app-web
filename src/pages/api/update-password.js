import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laptztfdcryylfjorfpl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must be set in Vercel environment variables

// Validate environment variable
if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Server configuration error',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
      },
    }
  );
}

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
            'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
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
            'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
          },
        }
      );
    }

    // Fetch user by email using admin API
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error al verificar el usuario',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
          },
        }
      );
    }

    const user = users.users.find((u) => u.email === email);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Correo electrónico no encontrado',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
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
            'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
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
          'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
        },
      }
    );
  } catch (err) {
    console.error('Error en el procesamiento:', err);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor: ' + err.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
        },
      }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://aplicacionadministrativa.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}