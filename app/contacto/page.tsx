import type { Metadata } from "next";
import MarcoPagina from "@/components/MarcoPagina";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo comunicarte con nosotros.",
};

export default function Contacto() {
  return (
    <MarcoPagina titulo="Contacto">
      <p>
        ¿Tienes preguntas, correcciones o comentarios sobre los datos? Escríbenos a:
      </p>
      <p className="font-serif text-2xl">
        <a href="mailto:contacto@solutions-bd.com" className="underline decoration-[#B8862E]">
          contacto@solutions-bd.com
        </a>
      </p>
      <p>
        Más información sobre{" "}
        <a
          href="https://www.solutions-bd.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Solutions for Business Data
        </a>
        .
      </p>
    </MarcoPagina>
  );
}
