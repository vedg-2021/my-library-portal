class UsersController < ApplicationController
    # POST /signup brings you here
    def create
      @user = User.new(user_params)
  
      if @user.save # @user.save tries to save what data we've to 
        # Send a response back with the user data (excluding the password)
        render json: { message: 'Sign Up Successfull. You are being redirected to Login page.', user: @user }, status: :created
      else
        # Return validation errors if user creation fails
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # GET /users
    def index
        @users = User.where(is_approved: true, is_deleted: false)
        render json: @users
    end

    def destroy

      @user = User.find_by(id: params[:id])

      if @user
        # Check if the user has any borrow records where 'returned_on' is null
        if @user.borrows.where(returned_on: nil).exists?
          render json: { error: "User has borrowed books that haven't been returned and cannot be deleted" }, status: :unprocessable_entity
        else
          # Proceed with deletion if no borrow records with 'returned_on' is null
          @user.update(is_deleted: true)
          render json: { message: "User deleted successfully", user: @user}, status: :ok
        end
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end

    def update
      @user = User.find_by(id: params[:id])
    
      if @user
        # Check if the new email is already taken by another user
        if user_params[:email].present? && User.exists?(email: user_params[:email]) && user_params[:email] != @user.email
          render json: { error: "Email is already taken by another user." }, status: :unprocessable_entity
        else
          if @user.update(user_params)
            render json: @user, status: :ok
          else
            render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end
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

    def listunapproved
      @user = User.where(is_approved: false, is_deleted: false)
      if @user
        render json: { message: "Pending approval list fetched", users: @user }, status: :ok
      else
        render json: { message: "error fetching the list" }, status: :not_found
      end
    end

    def approveuser
      @user = User.find_by(id: params[:id])
      if @user
        @user.update(user_params)
        render json: {message: "User Has been approved", user: {id: @user.id, email: @user.email, name: @user.name, is_approved: @user.is_approved}}, status: :ok
      else
        render json: { error: "User not found" }, status: :not_found
      end

    end

  
    private
  
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :phone, :address, :is_approved)
    end
end  