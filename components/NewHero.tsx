import React from 'react';

export const NewHero: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-20">
        <div className="md:flex md:items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
              Building the Future, Today.
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              We provide the best services for your company. Our team of experts is here to help you with all your needs.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
              >
                Get Started
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://picsum.photos/800/600"
              alt=""
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
