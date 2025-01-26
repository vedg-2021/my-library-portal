require 'jwt'
class SessionsController < ApplicationController
    def create
        if user_params[:type] === "user"
            @user = User.find_by(email: user_params[:email]);
            if @user && @user.authenticate(user_params[:password])
                secret_key = Rails.application.credentials.secret_key_base
                token = JWT.encode({user_id: @user.id, exp: 24.hours.from_now.to_i}, secret_key, 'HS256')
                render json: { message: 'Login successful', token: token, user: @user }, status: :ok
            else
                render json: {message: 'Invalid email or password'}, status: :unauthorized
            end
        elsif user_params[:type] === "librarian"
            @librarian = Librarian.find_by(email: user_params[:email]);
            if @librarian && @librarian.authenticate(user_params[:password])
                secret_key = Rails.application.credentials.secret_key_base
                token = JWT.encode({librarian_id: @librarian.id, exp: 24.hours.from_now.to_i}, secret_key, 'HS256')
                render json: { message: 'Login successful', token: token, librarian: @librarian }, status: :ok
            else
                render json: {message: 'Invalid email or password'}, status: :unauthorized
            end
        else
            @admin = Admin.find_by(email: user_params[:email]);
            if @admin && @admin.authenticate(user_params[:password])
                secret_key = Rails.application.credentials.secret_key_base
                token = JWT.encode({admin_id: @admin.id, exp: 24.hours.from_now.to_i}, secret_key, 'HS256')
                render json: { message: 'Login successful', token: token, admin: @admin }, status: :ok
            else
                render json: {message: 'Invalid email or password'}, status: :unauthorized
            end
        end
    end

    def user_params
        params.require(:session).permit(:email, :password, :type)
    end

    
end
