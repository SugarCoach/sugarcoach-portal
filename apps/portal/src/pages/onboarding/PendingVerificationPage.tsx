export default function PendingVerificationPage() {
  return (
    <div className="mx-auto max-w-xl rounded-sc-lg border border-gray-200 bg-white p-8 text-center shadow-sc-subtle">
      <h2 className="mb-3 text-2xl font-bold text-sc-text-primary">Ficha recibida</h2>
      <p className="mb-2 text-sc-text-secondary">
        Nuestro equipo está verificando tu NPI en el NPI Registry (NPPES) de CMS.gov.
      </p>
      <p className="text-sc-text-secondary">
        El plazo objetivo es de 1 día hábil. Te enviaremos un email de bienvenida en cuanto tu cuenta esté verificada y
        puedas usar el portal.
      </p>
    </div>
  );
}
