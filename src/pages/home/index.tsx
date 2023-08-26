import { useState, useEffect } from "react";
import { CarCategory } from "../../components/carCategory/carCategory";

import { Container } from "../../components/container";
import { BsSearch } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { RxReload } from "react-icons/rx";

import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-hot-toast";

import logoImg from "../../assets/drivexLogo.png";

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
  searchName: string;
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
  const [input, setInput] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

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
          searchName: doc.data().searchName,
        });
      });

      setCars(listcars);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCarReload() {
    setInput("");
    loadCars();
    toast.success(`Catalogo recarregado!`, {
      style: {
        fontSize: "14px",
      },
    });
  }

  async function handleSearchCar() {
    if (input === "") {
      toast.error(`Digite algo no campo de pesquisa!`, {
        style: {
          fontSize: "14px",
        },
      });
      return;
    }

    setCars([]);
    setLoadImages([]);

    const queries = [
      query(
        collection(db, "vehicles"),
        where("name", ">=", input.toUpperCase()),
        where("name", "<=", input.toUpperCase() + "\uf8ff")
      ),
      query(
        collection(db, "vehicles"),
        where("model", ">=", input.toUpperCase()),
        where("model", "<=", input.toUpperCase() + "\uf8ff")
      ),
      query(
        collection(db, "vehicles"),
        where("searchName", ">=", input.toUpperCase()),
        where("searchName", "<=", input.toUpperCase() + "\uf8ff")
      ),
    ];

    const queryPromises = queries.map((query) => getDocs(query));
    const querySnapshots = await Promise.all(queryPromises);

    const listcars = [] as CarsProps[];

    querySnapshots.forEach((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const carData = doc.data();
        const alreadyExists = listcars.some((car) => car.id === doc.id);
        if (!alreadyExists) {
          listcars.push({
            id: doc.id,
            name: carData.name,
            model: carData.model,
            version: carData.version,
            year: carData.year,
            km: carData.km,
            city: carData.city,
            state: carData.state,
            price: carData.price,
            images: carData.images,
            uid: carData.uid,
            searchName: carData.searchName,
          });
        }
      });
    });

    setCars(listcars);

    function capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (listcars.length > 0) {
      toast.success(
        `Exibindo resultados para "${capitalizeFirstLetter(
          input.toUpperCase()
        )}".`,
        {
          style: {
            fontSize: "14px",
          },
        }
      );
    }

    if (listcars.length === 0) {
      toast.error(
        `Não foram encontrados resultados para a pesquisa "${input.toUpperCase()}".`,
        {
          style: {
            fontSize: "14px",
          },
        }
      );
      loadCars();
    }
  }

  async function handleSearchCarType(bodyType: string) {
    setCars([]);

    const queryType = query(
      collection(db, "vehicles"),
      where("body", "==", bodyType)
    );

    try {
      const querySnapshot = await getDocs(queryType);

      const listcars = [] as CarsProps[];

      querySnapshot.forEach((doc) => {
        const carData = doc.data();
        listcars.push({
          id: doc.id,
          name: carData.name,
          model: carData.model,
          version: carData.version,
          year: carData.year,
          km: carData.km,
          city: carData.city,
          state: carData.state,
          price: carData.price,
          images: carData.images,
          uid: carData.uid,
          searchName: carData.searchName,
        });
      });

      setCars(listcars);
      toast.success(`Exibindo veículos da categoria ${bodyType}`, {
        style: {
          fontSize: "14px",
        },
      });
    } catch (error) {
      toast.error(`Erro ao exibir veículos.`, {
        style: {
          fontSize: "14px",
        },
      });
    }
  }

  const carButtons = [
    {
      carType: "Picape",
      imageUrl:
        "https://img.freepik.com/free-photo/front-view-fancy-car-available-selling_23-2148332887.jpg?w=740&t=st=1692916996~exp=1692917596~hmac=343dc79c8a3d77f2e978f60f58c5187c2e9e4e30b45cba74010e22dd71afd17c",
    },
    {
      carType: "Sedan",
      imageUrl:
        "https://img.freepik.com/free-photo/high-angle-new-car-available-selling_23-2148332890.jpg?w=740&t=st=1692916913~exp=1692917513~hmac=ca3d5e17bbc9641941863ea21ee666cd22d5192f2786f791f0652e55b72a4456",
    },
    {
      carType: "Hatch",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/close-do-espelho-retrovisor-de-um-carro-preto-coberto-de-gotas-de-chuva_181624-14701.jpg?w=740&t=st=1693011204~exp=1693011804~hmac=4871b7c306f56c9b53e9bba6ea8d9b40ef2dee4153b6ac23ac6484763fabce93",
    },
    {
      carType: "SUV",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/farois-poderosos-visao-de-particulas-de-carros-de-luxo-modernos-estacionados-dentro-de-casa-durante-o-dia_146671-17395.jpg?w=740&t=st=1692917917~exp=1692918517~hmac=568b64733f629004e768bdea62e54e638ec55ebbe1c92b3d370bb3e98ec640fd",
    },
    {
      carType: "Esportivo",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/lamborghini-closeup_181624-29209.jpg?w=740&t=st=1692917850~exp=1692918450~hmac=b72852df35bf4ab9e2673f44ca69ac33b9adbff759bf199a8edccd95ad6d2ade",
    },
    {
      carType: "Elétrico",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/carro-eletrico-na-estacao-de-recarga_53876-98188.jpg?w=740&t=st=1692918241~exp=1692918841~hmac=1a31e3b213dca548106bba7cb5261345d663a5e3f9b5b3aa73a331bbdd156a7e",
    },
  ];

  return (
    <Container>
      <div className="flex flex-col items-center justify-center">
        <img
          src={logoImg}
          alt="DriveX"
          className="mx-auto my-5 w-48 sm:w-72 h-auto"
        />

        <p className="text-xl text-gray-600 w-full text-center">
          Elevando sua experiência automotiva a um novo patamar
          <br />
          <span className="font-semibold text-lg md:text-xl">
            Descubra a paixão sobre quatro rodas!
          </span>
        </p>
      </div>

      <section className="bg-gray-100 px-2 rounded-lg w-full max-w-7xl mx-auto flex flex-col justify-center items-center gap-6 text-center mb-6">
        {/* Category search */}
        <section className="w-full max-w-7xl mx-auto mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {carButtons.map((carButton, index) => (
              <CarCategory
                key={index}
                carType={carButton.carType}
                imageUrl={carButton.imageUrl}
                handleSearchCarType={handleSearchCarType}
              />
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-slate-200"></div>

        <div className="flex items-center justify-center w-full max-w-5xl gap-2 bg-white p-3 rounded-md">
          <input
            type="text"
            placeholder="Pesquise por um veículo..."
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center justify-around">
            <button
              className="px-2 transition-all duration-200 ease-linear hover:scale-110 items-center justify-center flex gap-2 py-1"
              onClick={handleSearchCar}
            >
              <BsSearch size={24} color="#000" />
            </button>

            <button
              className="px-2 transition-all duration-200 ease-linear hover:scale-100 items-center justify-center flex gap-2 py-1"
              onClick={handleSearchCarReload}
            >
              <RxReload size={24} color="#000" />
            </button>
          </div>
        </div>
      </section>

      <main>
        <p className="text-xl text-gray-600 w-full mb-5 text-center">
          Explore a melhor seleção de carros novos e usados em todo o Brasil
        </p>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-center">
          {cars.map((car) => (
            <section
              key={car.id}
              className="w-full bg-white rounded-lg cursor-default shadow-lg"
            >
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

              <Link to={`/car/${car.id}`}>
                <p className="py-3 bg-mainRed hover:bg-mainRedLighter transition-all duration-300 ease-in-out font-medium text-white drop-shadow-lg">
                  Ver detalhes
                </p>
              </Link>
            </section>
          ))}
        </section>
      </main>
    </Container>
  );
}
