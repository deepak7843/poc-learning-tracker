import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <SignupForm />
      </div>

      <div className="hidden md:flex md:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-700 opacity-90 z-10" />
        <img
          alt="Learning background"
          src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
          <div className="text-white text-center max-w-md animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">
              Begin Your Learning Journey
            </h1>
            <p className="text-lg">
            Manage your professional development, track progress, and never stop learning with our comprehensive learning management platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;