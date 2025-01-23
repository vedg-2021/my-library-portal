Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  root "books#index"

  # Defines the root path route ("/")
  # root "posts#index"
  # Define the signup route
  post '/signup', to: 'users#create' # When a post request is made to /signup we send it to users controller create method
  get '/users', to: 'users#index'  # New route to fetch all users
  post '/add_librarian', to: 'librarians#create' 
  post '/add_book', to: 'books#create'
  post '/borrow_book', to: 'borrows#borrow'
  get '/book', to: 'books#index'
end
