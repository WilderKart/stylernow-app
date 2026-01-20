import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones | StylerNow",
    description: "Términos y condiciones de uso de la plataforma StylerNow.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans py-16 px-6 lg:px-24 max-w-5xl mx-auto">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-bold mb-4 tracking-tight text-black">Términos y Condiciones de Uso</h1>
                <p className="text-gray-500 font-medium">Última actualización: 20 de Enero, 2026</p>
            </header>

            <main className="space-y-10 text-lg leading-relaxed text-gray-700">
                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">1. Aceptación de los Términos</h2>
                    <p>
                        Bienvenido a <strong>StylerNow</strong>. Al acceder o utilizar nuestra plataforma (en adelante, el "Servicio" o "Plataforma"), usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al Servicio.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">2. Descripción del Servicio</h2>
                    <p>
                        StylerNow es una solución de Software as a Service (SaaS) que facilita la gestión operativa para barberías y la reserva de citas para usuarios finales. Actuamos exclusivamente como intermediario tecnológico.
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li><strong>Para Barberías:</strong> Proveemos herramientas de agenda, CRM y gestión.</li>
                        <li><strong>Para Usuarios:</strong> Proveemos un buscador y sistema de reservas.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">3. Limitación de Responsabilidad</h2>
                    <p>
                        StylerNow <strong>NO presta servicios de barbería ni estética</strong>. No garantizamos la calidad, seguridad o legalidad de los servicios ofrecidos por las Barberías registradas. Cualquier reclamación sobre el servicio recibido debe dirigirse directamente al establecimiento.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">4. Pagos y Tarifas</h2>
                    <p>
                        StylerNow no capta ni custodian dinero del público de forma directa. El procesamiento de pagos se realiza a través de pasarelas certificadas (ej. Wompi).
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>Los pagos por reserva son procesados directamente entre el Usuario y la Barbería o a través de la pasarela aliada.</li>
                        <li>StylerNow puede cobrar una tarifa por el uso del software (SaaS) a las Barberías, según el plan de suscripción elegido.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">5. Cuentas y Seguridad</h2>
                    <p>
                        Usted es responsable de custodiar la contraseña que utiliza para acceder al Servicio y de cualquier actividad bajo su cuenta. StylerNow no será responsable de pérdidas causadas por el uso no autorizado de su cuenta.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">6. Propiedad Intelectual</h2>
                    <p>
                        El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de StylerNow y sus licenciantes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">7. Legislación Aplicable</h2>
                    <p>
                        Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República de Colombia, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">8. Contacto</h2>
                    <p>
                        Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en: <br />
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
