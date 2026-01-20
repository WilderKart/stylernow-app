import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidad | StylerNow",
    description: "Política de tratamiento de datos personales de StylerNow en cumplimiento con la Ley 1581 de 2012.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans py-16 px-6 lg:px-24 max-w-5xl mx-auto">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-bold mb-4 tracking-tight text-black">Política de Tratamiento de Datos Personales</h1>
                <p className="text-gray-500 font-medium">Última actualización: 20 de Enero, 2026</p>
            </header>

            <main className="space-y-10 text-lg leading-relaxed text-gray-700">
                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">1. Introducción</h2>
                    <p>
                        StylerNow ("nosotros", "nuestro/a") se compromete a proteger su privacidad. Esta Política describe cómo recopilamos, usamos y tratamos sus datos personales, en estricto cumplimiento con la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013 de la República de Colombia.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">2. Recolección de Datos</h2>
                    <p>
                        Recopilamos información que usted nos proporciona directamente al registrarse, reservar una cita o comunicarse con nosotros. Esto puede incluir:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>Datos de identificación (Nombre, Correo electrónico, Teléfono).</li>
                        <li>Datos transaccionales (Historial de reservas).</li>
                        <li>Datos de ubicación (Sedes y geolocalización para check-in).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">3. Finalidad del Tratamiento</h2>
                    <p>
                        Sus datos personales serán tratados para las siguientes finalidades:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>Facilitar la reserva y gestión de citas con Barberías.</li>
                        <li>Enviar notificaciones sobre el estado de sus reservas (Confirmaciones, Recordatorios).</li>
                        <li>Mejorar nuestros servicios y seguridad.</li>
                        <li>Cumplir con obligaciones legales y contables.</li>
                    </ul>
                    <p className="mt-4">
                        <strong>Nota Importante:</strong> StylerNow no comercializa ni vende sus datos personales a terceros.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">4. Derechos de los Titulares (Habeas Data)</h2>
                    <p>
                        Como titular de los datos, usted tiene derecho a:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>Conocer, actualizar y rectificar sus datos personales.</li>
                        <li>Solicitar prueba de la autorización otorgada.</li>
                        <li>Ser informado sobre el uso que se le ha dado a sus datos.</li>
                        <li>Revocar la autorización y/o solicitar la supresión del dato.</li>
                        <li>Acceder en forma gratuita a sus datos personales.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">5. Seguridad de la Información</h2>
                    <p>
                        Implementamos medidas técnicas y administrativas rigurosas para proteger sus datos contra acceso no autorizado, pérdida o alteración, utilizando estándares de seguridad de la industria.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">6. Transferencia a Terceros</h2>
                    <p>
                        Podemos compartir información estrictamente necesaria con proveedores de servicios de confianza (ej. Pasarelas de Pago como Wompi, Servicios de Nube) para la operación de la plataforma. Estos terceros están obligados a mantener la confidencialidad de la información.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">7. Contacto para Tratamiento de Datos</h2>
                    <p>
                        Para ejercer sus derechos de Habeas Data o realizar consultas, puede contactar a nuestro oficial de privacidad en: <br />
                        <a href="mailto:equipo@stylernow.com" className="text-black font-bold underline hover:text-gray-600 transition-colors">
                            equipo@stylernow.com
                        </a>
                    </p>
                </section>
            </main>

            <footer className="mt-24 pt-8 border-t text-sm text-gray-500 text-center">
                &copy; {new Date().getFullYear()} StylerNow. Todos los derechos reservados.
            </footer>
        </div>
    );
}
