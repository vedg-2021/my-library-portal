Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  
  root "books#index"
  post '/signup', to: 'users#create' # When a post request is made to /signup we send it to users controller create method
  get '/users', to: 'users#index'  # New route to fetch all users
  get '/users/:id', to: 'users#show' # Fetch details of a specific user by ID
  put '/update_user/:id', to: 'users#update' # update user details
  delete '/users/:id', to: 'users#destroy'    # Delete a specific user by ID
  
  post '/login', to: 'sessions#create'

  get '/librarian/:id', to: 'librarians#show' # Fetch details of a specific user by ID
  get '/all_librarian', to: 'librarians#index'
  post '/add_librarian', to: 'librarians#create' 
  put '/update_librarian/:id', to: 'librarians#update'        # Update details of a specific librarian by ID
  delete '/delete_librarian/:id', to: 'librarians#destroy'

  get '/book', to: 'books#index'
  get '/books/:id', to: 'books#show'          # Fetch details of a specific book by ID
  post '/add_book', to: 'books#create'
  put '/books/:id', to: 'books#update'        # Update details of a specific book by ID
  delete '/books/:id', to: 'books#destroy'    # Delete a specific book by ID

  get '/borrowing_history', to: 'borrows#index' # Fetch borrowing history of a user
  get '/borrowing_history/:id', to: 'borrows#show' # Fetch borrowing history of a specific user
  get '/borrowing_history/user/:id', to: 'borrows#viewall' # Fetch borrowing history of a specific user
  post '/borrow_book', to: 'borrows#borrow'
  put '/return_book', to: 'borrows#return_book' # Return a borrowed book
  
  post '/add_admin', to: 'admins#create'
end
