import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ImageGallery from "./ImageGallery/ImageGallery";
import { fetchImages } from "../services/api";
import "../index.css";
import Loader from "./Loader/Loader";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import LoadMoreBtn from "./LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./ImageModal/ImageModal";
import { UnsplashImage } from "../services/api"; // Импортируем тип изображения

const App: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashImage[]>([]); // Массив изображений
  const [query, setQuery] = useState<string>(""); // Для обработки запроса в поисковом поле
  const [isLoading, setIsLoading] = useState<boolean>(false); // Индикатор загрузки
  const [isError, setIsError] = useState<boolean>(false); // Индикатор ошибки
  const [page, setPage] = useState<number>(1); // Номер страницы для подгрузки изображений
  const [isOpen, setIsOpen] = useState<boolean>(false); // Открытие/закрытие модального окна
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  ); // Выбранное изображение

  const handleOpenModal = (image: UnsplashImage) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  // Обработка поиска при сабмите формы
  const handleSearchSubmit = (searchQuery: string) => {
    setQuery(searchQuery); // Обновляем запрос
    setPhotos([]); // Очищаем массив изображений перед новым поиском
    setPage(1); // Возвращаемся на первую страницу
  };

  // Взаимодействие с бэкендом и рендеринг фотографий в галерею
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true); // Включаем индикатор загрузки
      setIsError(false); // Сбрасываем индикатор ошибки
      try {
        const response = await fetchImages({ query, perPage: 9, page }); // Вызов функции для получения изображений
        setPhotos((prev) => [...prev, ...response.results]); // Добавляем новые изображения к предыдущим
      } catch (error) {
        console.error("Error fetching images:", error);
        setIsError(true); // Устанавливаем индикатор ошибки в случае ошибки
      } finally {
        setIsLoading(false);
      }
    };

    if (query) getData(); // Выполняем запрос, если есть значение запроса
  }, [query, page]); // Выполняем при изменении query или page

  return (
    <div>
      <SearchBar setQuery={handleSearchSubmit} />
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
      {photos.length > 0 && !isLoading && !isError && (
        <LoadMoreBtn onClick={() => setPage((prev) => prev + 1)} />
      )}
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from "react";
// import SearchBar from "./SearchBar/SearchBar";
// import ImageGallery from "./ImageGallery/ImageGallery";
// import { fetchImages } from "../services/api";
// import "../index.css";
// import Loader from "./Loader/Loader";
// import ErrorMessage from "./ErrorMessage/ErrorMessage";
// import LoadMoreBtn from "./LoadMoreBtn/LoadMoreBtn";
// import ImageModal from "./ImageModal/ImageModal";

// interface Image {
//   id: string;
//   urls: {
//     small: string;
//     regular: string;
//     full: string;
//   };
//   alt_description: string;
// }

// const App: React.FC = () =  () => {
//   const [photos, setPhotos] = useState<Image[]>([]); // Масив зображень
//   const [query, setQuery] = useState<string>(""); // Для обробки запиту в пошуковому рядку
//   const [isLoading, setIsLoading] = useState<boolean>(false); // Індикатор завантаження
//   const [isError, setIsError] = useState<boolean>(false); // Індикатор помилки
//   const [page, setPage] = useState<number>(1); // Номер сторінки для підвантаження зображень
//   const [isOpen, setIsOpen] = useState<boolean>(false); // Відкриття/закриття модального вікна
//   const [selectedImage, setSelectedImage] = useState<Image | null>(null); // Вибране зображення

//   const handleOpenModal = (image: Image) => {
//     setSelectedImage(image);
//     setIsOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsOpen(false);
//     setSelectedImage(null);
//   };

//   // Обробка пошуку при сабміті форми
//   const handleSearchSubmit = (searchQuery:string) => {
//     setQuery(searchQuery); // Оновлюємо запит
//     setPhotos([]); // Очищуємо масив зображень перед новим пошуком
//     setPage(1); // Повертаємось на першу сторінку
//   };

//   // Взаємодія з бекендом та рендеринг фотографій в галерею
//   // Взаимодействие с бэкендом и рендеринг фотографий в галерею
//   useEffect(() => {
//     const getData = async () => {
//       setIsLoading(true); // Включаем индикатор загрузки
//       setIsError(false); // Сбрасываем индикатор ошибки
//       try {
//         const response = await fetchImages({ query, perPage: 9, page }); // Вызов функции для получения изображений
//         setPhotos((prev) => [...prev, ...response.results]); // Добавляем новые изображения к предыдущим
//       } catch (error) {
//         console.error("Error fetching images:", error);
//         setIsError(true); // Устанавливаем индикатор ошибки в случае ошибки
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (query) getData(); // Выполняем запрос, если есть значение запроса
//   }, [query, page]); // Выполняем при изменении query или page

//   return (
//     <div>
//       <SearchBar setQuery={handleSearchSubmit} />
//       {/* Передача функції обробки сабміту */}
//       {isOpen && selectedImage && (
//         <ImageModal
//           isOpen={isOpen}
//           onClose={handleCloseModal}
//           imageUrl={selectedImage.urls.regular}
//           altText={selectedImage.alt_description}
//         />
//       )}
//       <ImageGallery items={photos} onImageClick={handleOpenModal} />
//       {isLoading && <Loader />}
//       {isError && <ErrorMessage />}
//       <LoadMoreBtn onClick={() => setPage((prev) => prev + 1)} />
//     </div>
//   );
// };

// export default App;
