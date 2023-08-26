interface CarCategoryProps {
  carType: string;
  handleSearchCarType: (carType: string) => void;
  imageUrl: string;
}

export function CarCategory({
  carType,
  handleSearchCarType,
  imageUrl,
}: CarCategoryProps) {
  return (
    <button
      onClick={() => handleSearchCarType(carType)}
      className="flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 ease-in-out drop-shadow-lg"
    >
      <div className="relative">
        <img src={imageUrl} className="w-full h-32 object-cover rounded-md" />
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold text-white text-xl">
          {carType}
        </p>
      </div>
    </button>
  );
}
