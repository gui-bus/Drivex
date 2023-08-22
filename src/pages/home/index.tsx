import { useState, useEffect } from "react";

import { Container } from "../../components/container";
import { BsSearch } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";

import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

interface CarsProps {
  id: string;
  name: string;
  model: string;
  version: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  state: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {
    function loadCars() {
      const carsRef = collection(db, "vehicles");
      const queryRef = query(carsRef, orderBy("created", "desc"));

      getDocs(queryRef).then((snapshot) => {
        const listcars = [] as CarsProps[];

        snapshot.forEach((doc) => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            model: doc.data().model,
            version: doc.data().version,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            state: doc.data().state,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setCars(listcars);
      });
    }

    loadCars();
  }, []);

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  return (
    <Container>
      <section className="bg-gray-100 py-16 px-6 rounded-lg w-full max-w-3xl mx-auto flex flex-col justify-center items-center gap-6 text-center -mt-10">
        <p className="text-xl text-gray-600 max-w-xl font-semibold mb-2">
          Explore a melhor seleção de carros novos e usados em todo o Brasil.
          Encontre o veículo dos seus sonhos!
        </p>

        <div className="flex w-full gap-2 bg-white p-3 rounded-md">
          <input
            type="text"
            placeholder="Digite o nome do veículo..."
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          />
          <button className="px-2 transition-all duration-200 ease-linear hover:scale-110">
            <BsSearch size={24} color="#222423" />
          </button>
        </div>
      </section>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-center">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg hover:scale-102 transition-all duration-200 ease-linear cursor-pointer shadow-lg">
              <div
                className="w-full h-56 max-h-72 rounded-lg relative"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarLoader color={"#DC3237"} />
                </div>
              </div>

              <img
                src={car.images[0].url}
                alt="Veiculo"
                className="w-full rounded-t-lg mb-2 h-56 max-h-72 object-cover"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? "block" : "none",
                }}
              />
              <p className="font-bold my-2 px-2 uppercase lg:text-sm">
                {car.name} {car.model}
              </p>
              <p className="text-zinc-500 px-2 text-xs uppercase">
                {car.version}
              </p>

              <p className="text-zinc-500 px-2 text-xs">
                {car.year} | {parseFloat(car.km).toLocaleString("pt-BR")} km
              </p>

              <div className="flex flex-col px-2 text-sm my-3">
                <strong className="text-black font-medium text-2xl">
                  {typeof car.price === "string" ? (
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0, // Definindo 0 para não exibir casas decimais
                      }).format(parseFloat(car.price))}
                    </span>
                  ) : (
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0, // Definindo 0 para não exibir casas decimais
                      }).format(car.price)}
                    </span>
                  )}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2 text-sm">
                <span className="text-zinc-700 flex gap-1 justify-center items-center">
                  <GrLocation size={16} /> {car.city} - {car.state}
                </span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
