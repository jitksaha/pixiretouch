import clippingImg from "@/assets/service-clipping.jpg";
import bgImg from "@/assets/service-bgremoval.jpg";
import maskingImg from "@/assets/service-masking.jpg";
import shadowImg from "@/assets/service-shadow.jpg";
import ghostImg from "@/assets/service-ghost.jpg";
import productImg from "@/assets/service-product.jpg";
import jewelryImg from "@/assets/service-jewelry.jpg";
import ecommerceImg from "@/assets/service-ecommerce.jpg";
import colorImg from "@/assets/service-color.jpg";
import restorationImg from "@/assets/service-restoration.jpg";
import manipulationImg from "@/assets/service-manipulation.jpg";
import neckjointImg from "@/assets/service-neckjoint.jpg";
import enhancementImg from "@/assets/service-enhancement.jpg";

export const SERVICE_IMAGES: Record<string, string> = {
  "clipping-path": clippingImg,
  "background-removal": bgImg,
  "image-masking": maskingImg,
  "shadow-creation": shadowImg,
  "ghost-mannequin": ghostImg,
  "product-photo-retouching": productImg,
  "jewelry-retouching": jewelryImg,
  "ecommerce-image-editing": ecommerceImg,
  "color-correction": colorImg,
  "photo-restoration": restorationImg,
  "photo-manipulation": manipulationImg,
  "neck-joint": neckjointImg,
  "image-enhancement": enhancementImg,
};

export const serviceImage = (slug: string) => SERVICE_IMAGES[slug] ?? clippingImg;
