import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ImageGallery from "./ImageGallery/ImageGallery";
import { fetchImages } from "../services/api";
import "../index.css";
import Loader from "./Loader/Loader";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import LoadMoreBtn from "./LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./ImageModal/ImageModal";



interface Image {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
}

const App: React.FC= () =  () => {
  const [photos, setPhotos] = useState<Image[]>([]); // Масив зображень
  const [query, setQuery] = useState<string>(""); // Для обробки запиту в пошуковому рядку
  const [isLoading, setIsLoading] = useState<boolean>(false); // Індикатор завантаження
  const [isError, setIsError] = useState<boolean>(false); // Індикатор помилки
  const [page, setPage] = useState<number>(1); // Номер сторінки для підвантаження зображень
  const [isOpen, setIsOpen] = useState<boolean>(false); // Відкриття/закриття модального вікна
  const [selectedImage, setSelectedImage] = useState<Image | null>(null); // Вибране зображення

  const handleOpenModal = (image: Image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  // Обробка пошуку при сабміті форми
  const handleSearchSubmit = (searchQuery:string) => {
    setQuery(searchQuery); // Оновлюємо запит
    setPhotos([]); // Очищуємо масив зображень перед новим пошуком
    setPage(1); // Повертаємось на першу сторінку
  };

  // Взаємодія з бекендом та рендеринг фотографій в галерею
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true); // Включаємо індикатор завантаження
        setIsError(false); // Скидаємо індикатор помилки
        const response = await fetchImages(query, 9, page); // Виклик функції для отримання зображень
        setIsLoading(false); // Вимикаємо індикатор завантаження

        setPhotos((prev) => [...prev, ...response.results]); // Додаємо нові зображення до попередніх
      } catch (error) {
        console.log(error);
        setIsError(true); // Встановлюємо індикатор помилки у випадку помилки
      } finally {
        setIsLoading(false);
      }
    };
    if (query) getData(); // Виконуємо запит, якщо є значення запиту
  }, [query, page]); // Виконуємо при зміні query або page

  return (
    <div>
      <SearchBar setQuery={handleSearchSubmit} />
      {/* Передача функції обробки сабміту */}
      {isOpen && selectedImage && (
        <ImageModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          imageUrl={selectedImage.urls.regular}
          altText={selectedImage.alt_description}
        />
      )}
      <ImageGallery items={photos} onImageClick={handleOpenModal} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <LoadMoreBtn onClick={() => setPage((prev) => prev + 1)} />
    </div>
  );
};

export default App;
