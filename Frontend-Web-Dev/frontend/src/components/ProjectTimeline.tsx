"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Github, ExternalLink, Star } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

import LazyLoadImage from "@/components/LazyLoadImage";

interface Project {
  id: number;
  title: string;
  period: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  imageUrl: string;
  color: string;
}

const ProjectTimeline: React.FC = () => {
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);

  const projects: Project[] = [
    {
      id: 1,
      title: "AI Integration with React Vite",
      period: "June 2024 - Dec 2024",
      description:
        "Developed a web application using React and Vite, integrating AI features for enhanced user experience. Implemented responsive design and optimized performance.",
      technologies: [
        "React",
        "TypeScript",
        "Bootstrap",
        "React Query",
        "Axios",
        "Ant Design",
        "Google Cloud Platform",
        "Sass",
        "Vite",
      ],
      link: "https://chua-co-deloy-dau",
      github: "https://github.com/MinWuan/ai-integration-with-react-vite",
      imageUrl:
        "https://chatwithai.id.vn/file/AI-Integration-With-React-Vite-Application.png",
      color: "bg-purple-500",
    },
    {
      id: 2,
      title: "(Server) AI Integration with Node.js",
      period: "June 2024 - Dec 2024",
      description:
        "Created a backend server using Node.js and Express, integrating AI functionalities. Implemented RESTful APIs, database management, and authentication.",
      technologies: [
        "Node.js",
        "TypeScript",
        "Express",
        "MySQL",
        "Sequelize",
        "Redis",
        "Elasticsearch",
        "Multer",
        "NodeMailer",
        "Json Web Token",
        "Bcrypt",
        "Google Cloud Platform",
      ],
      github: "https://github.com/MinWuan/Backend_AI_Integration",
      imageUrl:
        "https://chatwithai.id.vn/file/Server-AI-Integration-With-React-Vite-Application.webp",
      color: "bg-cyan-500",
    },
    {
      id: 3,
      title: "Web News Application",
      period: "March 2025 - April 2025",
      description:
        "Developed a web application for news aggregation and display, utilizing Next.js and TypeScript. Implemented responsive design and optimized performance.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "React Query",
        "Axios",
        "Ant Design",
        "Cloudflare",
        "S3-AWS",
        "Docker",
        "Nginx",
        "Jwt",
        "Bcrypt",
        "Nodemailer",
        "Multer",
        "MongoDB",
        "CI/CD",
      ],
      link: "https://vxxxxxx7.com",
      github: "https://github.com/MinWuan/WEB-NEWS",
      imageUrl: "https://chatwithai.id.vn/file/Web-News.png",
      color: "bg-pink-500",
    },
    // {
    //   id: 4,
    //   title: "Social Media Analytics Tool",
    //   period: "Jan 2024 - Present",
    //   description:
    //     "Developing a comprehensive analytics platform for social media managers with customizable dashboards, trend analysis, and report generation.",
    //   technologies: [
    //     "Next.js",
    //     "TypeScript",
    //     "Tailwind CSS",
    //     "D3.js",
    //     "GraphQL",
    //   ],
    //   github: "https://github.com/yourusername/analytics-tool",
    //   imageUrl:
    //     "https://s3.cloudfly.vn/minwan/Screenshot%202023-12-19%20232253-1741633422551.png",
    //   color: "bg-indigo-500",
    // },
    // {
    //     id: 5,
    //     title: "Portfolio Website",
    //     period: "Ongoing",
    //     description:
    //         "Creating a personal portfolio website to showcase projects, skills, and experiences with a focus on performance and SEO.",
    //     technologies: [
    //         "Next.js",
    //         "TypeScript",
    //         "Tailwind CSS",
    //         "Framer Motion",
    //         "Vercel",
    //     ],
    //     link: "https://minwandev.io.vn",
    //     imageUrl:
    //         "https://s3.cloudfly.vn/minwan/Screenshot%202023-12-19%20232253-1741633422551.png",
    //     color: "bg-purple-500",
    // }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = Number(
              entry.target.getAttribute("data-project-id")
            );
            if (projectId && !visibleProjects.includes(projectId)) {
              setVisibleProjects((prev) => [...prev, projectId]);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const projectElements = document.querySelectorAll(".project-item");
    projectElements.forEach((el) => observer.observe(el));

    return () => {
      projectElements.forEach((el) => observer.unobserve(el));
    };
  }, [visibleProjects]);

  return (
    <>
   
    <div
      className="min-h-screen w-full py-12 px-4"
      //   style={{
      //     background: "radial-gradient(circle, rgba(22, 7, 60, 1) 11%, rgba(1, 9, 23, 1) 89%)",
      //   }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Danh sách dự án
          </span>
        </motion.h1>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute hidden sm:block left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-cyan-400 transform md:translate-x-px"></div>

          {/* Projects */}
          {projects.map((project, index) => (
            <div
              key={project.id}
              data-project-id={project.id}
              className={clsx(
                "project-item relative mb-24",
                index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:ml-auto",
                "md:w-1/2"
              )}
            >
              {/* Timeline dot with glow effect */}
              <motion.div
                className={clsx(
                  "hidden md:block absolute w-6 h-6 rounded-full top-6 z-10",
                  project.color,
                  "shadow-glow",
                  index % 2 === 0
                    ? "right-0 transform translate-x-3"
                    : "left-0 transform -translate-x-3"
                )}
                initial={{ scale: 0 }}
                animate={
                  visibleProjects.includes(project.id)
                    ? { scale: 1 }
                    : { scale: 0 }
                }
                transition={{ duration: 0.5 }}
                style={{
                  boxShadow: `0 0 15px ${
                    index % 4 === 0
                      ? "#a855f7"
                      : index % 4 === 1
                      ? "#06b6d4"
                      : index % 4 === 2
                      ? "#ec4899"
                      : "#6366f1"
                  }`,
                }}
              />

              {/* Project card */}
              <motion.div
                className="bg-gray-900/50 backdrop-blur-md rounded-xl shadow-xl p-6 relative z-20 border border-gray-800"
                initial={{ opacity: 0, y: 50 }}
                animate={
                  visibleProjects.includes(project.id)
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="absolute -top-3 -right-3">
                  <motion.div
                    className={`w-6 h-6 ${project.color} rounded-full flex items-center justify-center`}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Star size={12} className="text-white" />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {project.period}
                  </span>
                </div>

                <div className="mb-4 rounded-lg overflow-hidden group">
                  <div className="relative overflow-hidden rounded-lg">
                    {/* <Image
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      width={600}
                      height={400}
                    /> */}
                    <LazyLoadImage
                      height={"h-48"}
                      width={"w-full"}
                      options={{
                        src: project.imageUrl,
                        alt: project.title,
                        width: 600,
                        height: 400,
                        className:
                          "w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110",
                        loading: "lazy",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"></div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      className={clsx(
                        "px-2 py-1 text-xs rounded-full text-white",
                        project.color
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  {project.github && (
                    <a
                      href={project.github}
                      className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={16} className="mr-1" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectTimeline;
