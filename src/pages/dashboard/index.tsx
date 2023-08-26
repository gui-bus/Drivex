import { useEffect, useState, useContext } from "react";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelHeader";

import { FiTrash2 } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";

import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../contexts/authContext";

import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

import toast from "react-hot-toast";

interface CarProps {
  id: string;
  name: string;
  model: string;
  version: string;
  year: string;
  km: string;
  city: string;
  state: string;
  price: string | number;
  images: ImageCarProps[];
  uid: string;
}

interface ImageCarProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "vehicles");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

      getDocs(queryRef).then((snapshot) => {
        const listcars = [] as CarProps[];

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
  }, [user]);

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleDeleteCar(car: CarProps) {
    const itemCar = car;

    const docRef = doc(db, "vehicles", itemCar.id);
    await deleteDoc(docRef);

    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;

      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== itemCar.id));
      } catch (err) {
        toast.error("Erro ao excluir veículo!");
      }
    });
    toast.success("Veículo removido com sucesso!");
  }

  const greetings = {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
  };

  function getGreeting(hour: number) {
    if (hour >= 5 && hour < 12) {
      return greetings.morning;
    } else if (hour >= 12 && hour < 18) {
      return greetings.afternoon;
    } else {
      return greetings.evening;
    }
  }

  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentGreeting = getGreeting(currentHour);
    setGreeting(currentGreeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <section className="my-4">
        <h1 className="mt-5 mb-1 text-center font-semibold">
          {greeting}, {user?.name || "Visitante"}!
        </h1>
        <p className="text-center text-gray-600">
          {cars.length > 0
            ? `Você possui ${cars.length} ${
                cars.length === 1 ? "carro" : "carros"
              } registrado${
                cars.length === 1 ? "" : "s"
              } em sua conta. Sinta-se à vontade para gerenciá-lo${
                cars.length === 1 ? "" : "s"
              } a qualquer momento.`
            : "Você ainda não possui nenhum veículo cadastrado."}
        </p>
      </section>

      <DashboardHeader />
      <div className="w-full h-px bg-slate-200 mt-2 mb-4"></div>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <section
            key={car.id}
            className="w-full bg-white rounded-lg shadow-lg relative text-center"
          >
            <button
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
              onClick={() => handleDeleteCar(car)}
            >
              <FiTrash2 size={26} color="#000" />
            </button>

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

            <div className="cursor-default">
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
            </div>

            <Link to={`/car/${car.id}`}>
              <p className="py-3 bg-mainRed hover:bg-mainRedLighter transition-all duration-300 ease-in-out font-medium text-white drop-shadow-lg">
                Ver detalhes
              </p>
            </Link>
          </section>
        ))}
      </main>
    </Container>
  );
}
