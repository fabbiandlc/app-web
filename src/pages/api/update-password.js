// src/pages/api/update-password.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'La contraseña debe tener al menos 6 caracteres' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Adjust for production
          } 
        }
      );
    }

    const { error } = await supabase
      .from('app_settings')
      .update({ password: newPassword })
      .eq('id', 1);

    if (error) {
      console.error('Error al actualizar contraseña:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al actualizar la contraseña' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contraseña actualizada con éxito' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
        }
      );
  } catch (err) {
    console.error('Error en el procesamiento:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
}