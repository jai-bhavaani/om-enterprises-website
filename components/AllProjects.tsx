import React from 'react';
import { projects } from '../src/data/projects'; // Adjust path as necessary
import { Link } from 'react-router-dom';

const AllProjects: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="border rounded-lg shadow-lg overflow-hidden">
            <img src={project.images[0]} alt={project.title} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.name}</p>
               {project.value && (
                  <p className="text-sm text-gray-500">Value: {project.value}</p>
               )}
               {project.scope && (
                   <p className="text-sm text-gray-500 mt-1">{project.scope}</p>
               )}
              
              {/* Add a link to a detailed project page if applicable */}
              {/* <Link to={`/projects/${project.id}`} className="text-blue-500 hover:underline mt-2 block">
                View Details
              </Link> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
