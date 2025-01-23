class LibrariansController < ApplicationController
    def create
        @librarian = Librarian.new(lib_params)

        if @librarian.save
            render json: {message: "Librarian added!", librarian: @librarian}, status: :created
        else
        render json: { errors: @librarian.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def lib_params
        params.require(:librarian).permit(:name, :email, :password, :password_confirmation, :phone, :address)
    end
end
