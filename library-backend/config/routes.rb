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
  post '/login', to: 'sessions#create'
  get '/books/:id', to: 'books#show'          # Fetch details of a specific book by ID
  put '/books/:id', to: 'books#update'        # Update details of a specific book by ID
  delete '/books/:id', to: 'books#destroy'    # Delete a specific book by ID
  delete '/users/:id', to: 'users#destroy'    # Delete a specific user by ID
  get '/borrowing_history', to: 'borrows#index' # Fetch borrowing history of a user
  get '/borrowing_history/:id', to: 'borrows#show' # Fetch borrowing history of a specific user
  put '/return_book', to: 'borrows#return_book' # Return a borrowed book
  get '/borrowing_history/user/:id', to: 'borrows#viewall' # Fetch borrowing history of a specific user
  put '/update_user/:id', to: 'users#update' # update user details
  get '/users/:id', to: 'users#show' # Fetch details of a specific user by ID
end
