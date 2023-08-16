import { Container } from "../../components/container";
import { BsSearch } from "react-icons/bs";

export function Home() {
  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Digite o nome do veículo..."
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
        />
        <button className="px-2 transition-all duration-200 ease-linear hover:scale-110">
          <BsSearch size={24} color="#222423" />
        </button>
      </section>

      <h1 className="font-semibold text-center my-6 text-xl">
        Navegue pela maior seleção de carros novos e usados em todo o Brasil!
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 text-center">
        <section className="w-full bg-white rounded-lg hover:scale-102 transition-all duration-200 ease-linear cursor-pointer shadow-lg">
          <img
            src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2023/202308/20230805/ferrari-sf90-3.9-v8-turbo-phev-stradale-f1dct-wmimagem14292271233.jpg?s=fill&w=552&h=414&q=60"
            alt="Veiculo"
            className="w-full rounded-t-lg mb-2 max-h-72"
          />
          <p className="font-bold mt-1 px-2">FERRARI SF90</p>
          <p className="text-zinc-700 px-2 text-sm">
            3.9 V8 TURBO PHEV STRADALE F1-DCT
          </p>

          <div className="flex flex-col px-2 text-sm">
            <span className="text-zinc-700 mb-3">
              Ano 2021/2022 | 23.000 km
            </span>
            <strong className="text-black font-medium text-2xl">
              R$ 5.550.000
            </strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="px-2 pb-2">
            <span className="text-zinc-700">Uberlândia - MG</span>
          </div>
        </section>
      </main>
    </Container>
  );
}
