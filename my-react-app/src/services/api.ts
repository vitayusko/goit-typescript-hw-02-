import axios from "axios";

// парсим данные м ансплэша шаг 1
interface FetchImagesParams {
  query: string;
  perPage?: number;
  page?: number;
}
interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
}

interface UnsplashResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}
export const fetchImages = async ({
  query,
  perPage = 9,
  page = 1,
}: FetchImagesParams): Promise<UnsplashResponse> => {
  const response = await axios.get("https://api.unsplash.com/search/photos", {
    params: {
      query,
      per_page: perPage,
      page,
    },
    headers: {
      Authorization: "Client-ID OY7E_vy_zvJ3W0dB39G5FF10cnIMiqwZ6msbbNgPcuk",
    },
  });
  return response.data;
};
