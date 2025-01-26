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

    def destroy
      @user = User.find_by(id: params[:id])
      if @user
        @user.destroy
        render json: { message: "User deleted successfully" }, status: :ok
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end

    def update
      @user = User.find_by(id: params[:id])
      if @user
        @user.update(user_params)
        render json: @user, status: :ok
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end

    def show
      @user = User.find_by(id: params[:id])
      if @user
        render json: @user
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end

  
    private
  
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :phone, :address)
    end
end  