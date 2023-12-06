import { Link, useParams } from "react-router-dom";

function EditOrderPage() {
  const { id } = useParams();

  return (
    <div>
      <Link to="../">Volver</Link>
      <h2 className="text-2xl font-bold mb-4">Editar Orden #{id}</h2>
      <div className="p-6 w-full h-96 grid place-content-center border-2 rounded-md">
        <p className="text-2xl text-zinc-400">Formulario de edicion</p>
      </div>
    </div>
  );
}

export default EditOrderPage;
