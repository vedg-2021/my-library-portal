require 'jwt'
class SessionsController < ApplicationController
    def create
        if user_params[:type] === "user"
            @user = User.find_by(email: user_params[:email]);
            if @user
                if @user.is_deleted && !(@user.is_approved)
                    render json: { message: 'Your Application was rejected. Please contact Librarian!'}, status: :unauthorized
                elsif !(@user.is_approved) && @user.authenticate(user_params[:password])
                    render json: {message: 'Your application is under reivew. Please Try again later.'}, status: :forbidden
                elsif @user.is_deleted && @user.authenticate(user_params[:password])
                    render json: {message: 'Your profile was deleted.'}, status: :forbidden
                elsif @user.authenticate(user_params[:password])
                    secret_key = Rails.application.credentials.secret_key_base
                    payload = {
                        user_id: @user.id,
                        name: @user.name,
                        email: @user.email,
                        exp: 24.hours.from_now.to_i # Token expiration time
                    }
                    token = JWT.encode(payload, secret_key, 'HS256')
                    render json: { message: 'Login successful', token: token, user: @user }, status: :ok
                else
                    render json: {message: 'Invalid email or password'}, status: :unauthorized
                end
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
