import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";

import { useNavigate, useParams, Link } from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Swiper, SwiperSlide } from "swiper/react";

import { TbArrowBack } from "react-icons/tb";

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
  armored: string;
  color: string;
  description: string;
  gas: string;
  inspections: string;
  ipva: string;
  license: string;
  owner: string;
  plateEnd: string;
  trade: string;
  transmission: string;
  whatsapp: string;
  created: string;
  vehicleOwner: string;
  body: string;
  images: ImagesCarProps[];
}

interface ImagesCarProps {
  name: string;
  uid: string;
  url: string;
}

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarsProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "vehicles", id);
      getDoc(docRef).then((snapshot) => {
        if (snapshot.data() === undefined) {
          navigate("/");
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          version: snapshot.data()?.version,
          year: snapshot.data()?.year,
          price: snapshot.data()?.price,
          city: snapshot.data()?.city,
          state: snapshot.data()?.state,
          km: snapshot.data()?.km,
          armored: snapshot.data()?.armored,
          color: snapshot.data()?.color,
          description: snapshot.data()?.description,
          inspections: snapshot.data()?.inspections,
          gas: snapshot.data()?.gas,
          ipva: snapshot.data()?.ipva,
          license: snapshot.data()?.license,
          owner: snapshot.data()?.owner,
          plateEnd: snapshot.data()?.plateEnd,
          transmission: snapshot.data()?.transmission,
          whatsapp: snapshot.data()?.whatsapp,
          created: snapshot.data()?.created,
          vehicleOwner: snapshot.data()?.vehicleOwner,
          uid: snapshot.data()?.uid,
          images: snapshot.data()?.images,
          trade: snapshot.data()?.trade,
          body: snapshot.data()?.body,
        });
      });
    }

    loadCar();
  }, [id]);

  function formatPhoneNumber(whatsapp: string) {
    const cleanedPhoneNumber = whatsapp.replace(/\D/g, "");
    if (cleanedPhoneNumber.length === 11) {
      const areaCode = cleanedPhoneNumber.slice(0, 2);
      const firstPart = cleanedPhoneNumber.slice(2, 7);
      const secondPart = cleanedPhoneNumber.slice(7);
      return `(${areaCode}) ${firstPart}-${secondPart}`;
    } else {
      return whatsapp;
    }
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          scrollbar={{ draggable: true }}
          className="swiper-container"
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full h-96 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black text-center">
              {car?.name} <span className="text-mainRed">{car?.model}</span>
            </h1>
            <h1 className="font-bold text-3xl text-black my-3 sm:my-0">
              {typeof car?.price === "string" ? (
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
            </h1>
          </div>
          <p className="text-center sm:text-left -mt-3 text-zinc-500">
            {car.version}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-5 text-center my-5 gap-y-3">
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Cidade</p>
              <p className="font-semibold">
                {car?.city} - {car?.state}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Ano</p>
              <p className="font-semibold">{car?.year}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">KM</p>
              <p className="font-semibold">
                {parseFloat(car?.km).toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Câmbio</p>
              <p className="font-semibold">{car?.transmission}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Tipo</p>
              <p className="font-semibold">{car?.body}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Combustivel</p>
              <p className="font-semibold">{car?.gas}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Cor</p>
              <p className="font-semibold">{car?.color}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Final de placa</p>
              <p className="font-semibold">{car?.plateEnd}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Aceita troca</p>
              <p className="font-semibold">{car?.trade}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">IPVA pago</p>
              <p className="font-semibold">{car?.ipva}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Licenciado</p>
              <p className="font-semibold">{car?.license}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Revisões em dia</p>
              <p className="font-semibold">{car?.inspections}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Blindado</p>
              <p className="font-semibold">{car?.armored}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Único dono</p>
              <p className="font-semibold">{car?.owner}</p>
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Items do veículo</p>
              <p className="text-center sm:text-left sm:p-0 ">
                {car?.description}
              </p>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">Sobre o vendedor</p>
              <p className="font-semibold">{car?.vehicleOwner}</p>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-zinc-500 text-sm">WhatsApp</p>
              <p className="font-semibold">
                {formatPhoneNumber(car?.whatsapp)}
              </p>
            </div>
          </div>

          <a
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá! Gostaria de conversar sobre o ${car?.name} ${car?.model} que vi em seu anúncio no site DriveX. Poderia me fornecer mais informações a respeito? Obrigado!`}
            target="_blank"
            className="bg-green-500 hover:bg-green-600 transition-all duration-300 ease-in-out px-2 w-full text-white flex items-center justify-center gap-2 my-6 h-11 rounded-lg font-medium cursor-pointer"
          >
            Conversar com o vendedor <FaWhatsapp size={16} color="#fff" />{" "}
          </a>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="-mb-4 py-2">
            <Link
              to="/"
              className="flex gap-1 p-2 transition-all duration-300 ease-in-out rounded-full w-fit font-medium mx-auto hover:bg-gray-100"
            >
              <TbArrowBack size={24} />
              Voltar para o catalogo
            </Link>
          </div>
        </main>
      )}
    </Container>
  );
}
