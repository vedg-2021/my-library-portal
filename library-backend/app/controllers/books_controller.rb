class BooksController < ApplicationController
    def index
        @books = Book.all
        render json: @books
    end
    def create
        @book = Book.new(book_params)
        if @book.save
            render json: {message: "Book Added!", book: @book}, status: :created
        else
            render json: {erros: @book.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def book_params
        params.require(:book).permit(:title, :author, :publication_date, :genre, :availability_status)
    end
end
