import { useEffect, useState } from "react";

export interface PieEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  isBestseller: boolean;
}

export const usePieRepository = () => {
  const [pies, setPies] = useState<PieEntity[]>([]);

  useEffect(() => {
    // Static data matching the visual mockup
    setPies([
      {
        id: "1",
        name: "Classic Buko Pie",
        description: "Creamy young coconut",
        price: 350,
        rating: 4.9,
        isBestseller: true,
        imageUrl: "https://placehold.co/300x300/E0D0C0/3E2723?text=Buko+Pie",
      },
      {
        id: "2",
        name: "Choco Pecan Bliss",
        description: "Rich chocolate pecan",
        price: 420,
        rating: 4.9,
        isBestseller: true,
        imageUrl: "https://placehold.co/300x300/3E2723/FFFBF2?text=Choco+Pecan",
      },
      {
        id: "3",
        name: "Apple Caramel Crumb",
        description: "Cinnamon apples with crumb",
        price: 380,
        rating: 4.9,
        isBestseller: false,
        imageUrl:
          "https://placehold.co/300x300/FF9F1C/3E2723?text=Apple+Caramel",
      },
      {
        id: "4",
        name: "Chicken Pot Pie",
        description: "Hearty chicken & veg",
        price: 320,
        rating: 4.9,
        isBestseller: false,
        imageUrl: "https://placehold.co/300x300/8D6E63/FFFBF2?text=Chicken+Pot",
      },
    ]);
  }, []);

  return { pies };
};
