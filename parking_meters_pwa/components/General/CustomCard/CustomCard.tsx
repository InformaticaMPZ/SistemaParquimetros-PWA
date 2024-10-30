import React from "react";

interface CustomCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  classNameCard?:string;
}
export const CustomCard = ({ title, children, className,classNameCard }: CustomCardProps) => {
  return (
    <section className={`card bg-white  rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700 ${classNameCard}`}>
      {title && (
        <div className="card-header bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 p-4 rounded-t-xl text-center">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </div>
      )}
      <div className={`card-body ${className}`}>
        <div className="flex flex-col justify-between leading-normal">
          {children}
        </div>
      </div>
    </section>

  );
};
export default CustomCard;
