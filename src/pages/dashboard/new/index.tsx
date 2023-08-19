import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelHeader";

import { FiUpload, FiTrash } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";
import { GiCarKey } from "react-icons/gi";

import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthContext } from "../../../contexts/authContext";
import { v4 as uuidV4 } from "uuid";
import { storage } from "../../../services/firebaseConnection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const schema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  model: z.string().nonempty("Campo obrigatório"),
  year: z.string().nonempty("Campo obrigatório"),
  km: z.string().nonempty("Campo obrigatório"),
  price: z.string().nonempty("Campo obrigatório"),
  city: z.string().nonempty("Campo obrigatório"),
  state: z.string().nonempty("Campo obrigatório"),
  whatsapp: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Numero inválido",
    }),
  description: z.string().nonempty("Campo obrigatório"),
  gas: z.string().nonempty("Campo obrigatório"),
  color: z.string().nonempty("Campo obrigatório"),
  body: z.string().nonempty("Campo obrigatório"),
  plateEnd: z.string().nonempty("Campo obrigatório"),
  transmission: z.string().nonempty("Campo obrigatório"),
  ipva: z.string().nonempty("Campo obrigatório"),
  owner: z.string().nonempty("Campo obrigatório"),
  trade: z.string().nonempty("Campo obrigatório"),
  license: z.string().nonempty("Campo obrigatório"),
  armored: z.string().nonempty("Campo obrigatório"),
  inspections: z.string().nonempty("Campo obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Envie uma imagem em formato JPEG ou PNG!");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downLoadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downLoadUrl,
        };

        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  function onSubmit(data: FormData) {
    console.log(data);
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages((prevCarImages) =>
        prevCarImages.filter((car: ImageItemProps) => car.url !== item.url)
      );
    } catch (err) {
      console.log("ERRO AO DELETAR");
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <h1 className="mt-2 mb-4 text-center font-medium text-xl">
        Preencha o formulário abaixo com as informaçoes do veículo
      </h1>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do veículo"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2 text-sm">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: LAMBORGHINI URUS..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 4.0 V8 TURBO..."
            />
          </div>

          <div className="flex w-full mb-3 flex-col md:flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Carroceria</p>
              <select
                {...register("body")}
                name="body"
                className="border-2 w-full rounded-lg h-11 px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Crossover">Crossover</option>
                <option value="Minivan">Minivan</option>
                <option value="Picape">Picape</option>
                <option value="Coupé">Coupé</option>
                <option value="Conversível">Conversível</option>
                <option value="Esportivo">Esportivo</option>
                <option value="Utilitário">Utilitário</option>
              </select>
              {errors.body && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.body?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 text-gray-600 font-medium">Preço</p>
              <input
                type="text"
                {...register("price")}
                name="price"
                onKeyDown={(e) => {
                  const allowedKeys = /[0-9.]/;
                  if (!allowedKeys.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                  if (e.key === "." || e.key === ",") {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const value = parseFloat(
                    e.target.value.replace(".", "").replace(",", ".")
                  );
                  if (!isNaN(value)) {
                    const formattedValue = value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                    e.target.value = formattedValue;
                  }
                }}
                className="border-2 w-full rounded-lg h-11 px-2"
                placeholder="Ex: R$ 2.000.000,00"
              />
              {errors.price && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.price?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 text-gray-600 font-medium">Ano</p>
              <input
                type="text"
                {...register("year")}
                name="year"
                onKeyDown={(e) => {
                  const allowedKeys = /[0-9.]/;
                  if (!allowedKeys.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                  if (e.key === "." || e.key === ",") {
                    e.preventDefault();
                  }
                }}
                className="border-2 w-full rounded-lg h-11 px-2"
                placeholder="Ex: 2018/2019..."
              />
              {errors.year && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.year?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 text-gray-600 font-medium">Km rodados</p>
              <input
                type="text"
                {...register("km")}
                name="km"
                onKeyDown={(e) => {
                  const allowedKeys = /[0-9.]/;
                  if (!allowedKeys.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                  if (e.key === "." || e.key === ",") {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const value = parseFloat(
                    e.target.value.replace(".", "").replace(",", ".")
                  );
                  if (!isNaN(value)) {
                    const formattedValue =
                      value
                        .toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 20,
                        })
                        .replace(",", ".") + "km";
                    e.target.value = formattedValue;
                  }
                }}
                className="border-2 w-full rounded-lg h-11 px-2"
                placeholder="Ex: 8.800km..."
              />
              {errors.km && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.km?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Combustível</p>
              <select
                {...register("gas")}
                name="gas"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Gasolina">Gasolina</option>
                <option value="Álcool">Álcool</option>
                <option value="Flex">Flex</option>
                <option value="Diesel">Diesel</option>
                <option value="GNV">GNV</option>
                <option value="Elétrico">Elétrico</option>
              </select>
              {errors.gas && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.gas?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 text-gray-600 font-medium">Cor</p>
              <select
                {...register("color")}
                name="color"
                className="border-2 w-full rounded-lg h-11 px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Preto">Preto</option>
                <option value="Branco">Branco</option>
                <option value="Prata">Prata</option>
                <option value="Cinza">Cinza</option>
                <option value="Vermelho">Vermelho</option>
                <option value="Azul">Azul</option>
                <option value="Verde">Verde</option>
                <option value="Amarelo">Amarelo</option>
                <option value="Laranja">Laranja</option>
                <option value="Marrom">Marrom</option>
                <option value="Roxo">Roxo</option>
                <option value="Outra">Outra</option>
              </select>
              {errors.color && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.color?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 text-gray-600 font-medium">Câmbio</p>
              <select
                {...register("transmission")}
                name="transmission"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="Semi-Automático">Semi-Automático</option>
              </select>
              {errors.transmission && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.transmission?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Final da placa</p>
              <select
                {...register("plateEnd")}
                name="plateEnd"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
              {errors.plateEnd && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.plateEnd?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Único dono</p>
              <select
                {...register("owner")}
                name="owner"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.owner && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.owner?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Aceita troca</p>
              <select
                {...register("trade")}
                name="trade"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.trade && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.trade?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Licenciado</p>
              <select
                {...register("license")}
                name="license"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.license && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.license?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">IPVA pago</p>
              <select
                {...register("ipva")}
                name="ipva"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.ipva && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.ipva?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Revisão em dia</p>
              <select
                {...register("inspections")}
                name="inspections"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.inspections && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.inspections?.message}</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Blindado</p>
              <select
                {...register("armored")}
                name="armored"
                className="border-2 w-full rounded-lg h-11  px-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.armored && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.armored?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mb-3 flex-col md:flex-row items-center gap-4">
            <div className="w-full flex gap-4">
              <div className="w-full">
                <p className="mb-2 text-gray-600 font-medium">Cidade</p>

                <Input
                  type="text"
                  register={register}
                  name="city"
                  error={errors.city?.message}
                  placeholder="Ex: Guarulhos..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2 font-medium">Estado</p>
                <select
                  {...register("state")}
                  name="state"
                  className="border-2 w-full rounded-lg h-11 px-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
                {errors.state && (
                  <div className="flex items-center gap-1 my-2 font-medium text-sm">
                    <CgDanger size={16} color="#EF4444" />
                    <p className="text-red-500">{errors.state?.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Whatsapp</p>
              <input
                type="text"
                {...register("whatsapp")}
                name="whatsapp"
                onKeyDown={(e) => {
                  const allowedKeys = /[0-9]/;
                  if (!allowedKeys.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const inputValue = e.target.value.replace(/\D/g, "");
                  if (inputValue.length === 11) {
                    const formattedValue = `(${inputValue.substring(
                      0,
                      2
                    )}) ${inputValue.substring(2, 7)}-${inputValue.substring(
                      7
                    )}`;
                    e.target.value = formattedValue;
                  }
                }}
                className="border-2 w-full rounded-lg h-11 px-2"
                placeholder="Ex: 01299999999..."
              />
              {errors.whatsapp && (
                <div className="flex items-center gap-1 my-2 font-medium text-sm">
                  <CgDanger size={16} color="#EF4444" />
                  <p className="text-red-500">{errors.whatsapp?.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Informaçoes adicionais</p>
            <textarea
              className="border-2 w-full rounded-lg h-24 px-2 py-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite neste campo uma descrição completa sobre o veículo ou qualquer outra informação adicional necessária..."
            />
            {errors.description && (
              <div className="flex items-center gap-1 my-2 font-medium text-sm">
                <CgDanger size={16} color="#EF4444" />
                <p className="text-red-500">{errors.description.message}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="flex gap-2 items-center justify-center w-full h-10 rounded-lg bg-mainRed hover:bg-mainRedLighter transition-all duration-200 ease-in-out text-white font-medium"
          >
            Cadastrar <GiCarKey size={24} color="#FFF" />
          </button>
        </form>
      </div>
    </Container>
  );
}
