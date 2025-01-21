class UsersController < ApplicationController
    # POST /signup brings you here
    def create
      @user = User.new(user_params)
  
      if @user.save # @user.save tries to save what data we've to 
        # Send a response back with the user data (excluding the password)
        render json: { message: 'User created successfully. You can now Login', user: @user }, status: :created
      else
        # Return validation errors if user creation fails
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # GET /users
    def index
        @users = User.all
        render json: @users
    end

  
    private
  
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end  