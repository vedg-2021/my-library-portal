class LibrariansController < ApplicationController
    def create
        @librarian = Librarian.new(lib_params)

        if @librarian.save
            render json: {message: "Librarian added!", librarian: @librarian}, status: :created
        else
        render json: { errors: @librarian.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def index
        @librarians = Librarian.all
        render json: @librarians
    end

    def destroy
        @librarian = Librarian.find_by(id: params[:id])
        if @librarian
            @librarian.destroy
            render json: { message: "Librarian Deleted Successfully!" }, status: :ok
        else
            render json: { error: "Librarian not found" }, status: :not_found
        end
    end

    def update
        @librarian = Librarian.find_by(id: params[:id])
      if @librarian
        @librarian.update(lib_params)
        render json: @librarian, status: :ok
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end

    def show
        @librarian = Librarian.find_by(id: params[:id])
        if @librarian
          render json: @librarian
        else
          render json: { error: "Librarian not found!" }, status: :not_found
        end
    end

    def lib_params
        params.require(:librarian).permit(:name, :email, :password, :password_confirmation, :phone, :address)
    end
end
