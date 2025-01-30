class BooksController < ApplicationController
    def index
        @books = Book.all
        render json: @books
    end
    def create
        @book = Book.new(book_params)
        if @book.save
            render json: {message: "Book Added Successfully!", book: @book}, status: :created
        else
            render json: {erros: @book.errors.full_messages}, status: :unprocessable_entity
        end
    end

    
  def show
    @book = Book.find_by(id: params[:id])
    if @book
      render json: @book
    else
      render json: { error: "Book not found" }, status: :not_found
    end
  end

  
  def update
    @book = Book.find_by(id: params[:id])
    if @book
      if @book.update(book_params)
        render json: { message: "Book updated successfully", book: @book }, status: :ok
      else
        render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: "Book not found" }, status: :not_found
    end
  end

  def destroy
      @book = Book.find_by(id: params[:id])
      if @book
          @book.destroy
          render json: { message: "Book deleted successfully" }, status: :ok
      else
          render json: { error: "Book not found" }, status: :not_found
      end
  end


    def book_params
        params.require(:book).permit(:title, :author, :publication_date, :genre, :availability_status, :current_quantity, :total_quantity, :isbn, :price)
    end
end
