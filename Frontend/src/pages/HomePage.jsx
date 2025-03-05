import React from 'react'
import CategoryItem from '../components/CategoryItem';

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "https://imgs.search.brave.com/D_KO2uvCbd2j4MlFXtBwOJz5Cxucagfu9K6OBB1N48I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZWx1/eGVmYXNoaW9uLmNv/L2Nkbi9zaG9wL3By/b2R1Y3RzL0hlNWNk/MjhkNmE2NTQ0YjZk/YWNiZmRmMjMwNDQ1/NzgzNVQuanBnP3Y9/MTY4ODcxODE3Mw" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "https://imgs.search.brave.com/6EwP6xsrThHF9ggWvureXcRVhBBvJpxTd5OztgFg8Tw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cnR1/cm1zLmNvbS9jZG4v/c2hvcC9maWxlcy80/XzAwMTJfdHVybXMx/NHRoMjIxMjcuanBn/P3Y9MTcyOTMzOTk2/MCZ3aWR0aD0zODQw" },
  { href: "/shoes", name: "Shoes", imageUrl: "https://imgs.search.brave.com/QAIkfcEyKMkwQU9GD08LLeRlYHEdE9Ylt_QG4ohl4Xc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFnYkZKWXptckwu/anBn" },
  { href: "/glasses", name: "Glasses", imageUrl: "https://imgs.search.brave.com/__OrJj1u9jcOzaJwT3qxdkcJAaFbIee5SMOG_AlI13M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFJTnpmbms3MEwu/anBn" },
  { href: "/jackets", name: "Jackets", imageUrl: "https://imgs.search.brave.com/E_Uqe9wtBWI_wPFHH9OjYoaMYwK6uoL31XnotgJWGFw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzkzLzcxLzM3/LzM2MF9GXzkzNzEz/NzU1X2NPN3lDMzMx/Z2RxYlBJbXE3VDJO/bnc5UDJCUnM4eERi/LmpwZw" },
  { href: "/suits", name: "Suits", imageUrl: "https://imgs.search.brave.com/bky8ZMjjoQJJuQ4-ha0Jv7YmOVF_3Jx8z_ER2fdM5Ts/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5ncS1tYWdhemlu/ZS5jby51ay9waG90/b3MvNjY4YmJiODM0/ZmE5M2EwMDc5Y2Q0/OThjLzM6NC93Xzc0/OCxjX2xpbWl0L1Bp/Y3R1cmVQcm9qZWN0/X1N1aXRzX0hhd2Vz/LSYtQ3VydGlzLXdv/b2wtc3VpdC5qcGc" },
  { href: "/bags", name: "Bags", imageUrl: "https://imgs.search.brave.com/iAe4Nvy_MNLkNrDr28ip1X_mfvgfSEXQwX6PS1kBk80/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9weXhp/cy5ueW1hZy5jb20v/djEvaW1ncy9iYzAv/NzMzLzZjN2ZhNDky/NjNlNjA2OTZlYTdk/ZTU3OGU5NDE0ODg0/ZDItZGFnbmUtZG92/ZXItb255eC5yc3F1/YXJlLnc2MDAuanBn" },
];
const HomePage = () => {
  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Explore our Categories</h1>
        <p className='text-center text-xl text-gray-300 mb-12'>Dicover the latest fashion trends and styles</p>
        <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            categories.map((category) => (
              <CategoryItem key={category.name} category={category} />
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default HomePage
