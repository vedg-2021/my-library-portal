class BooksController < ApplicationController
    def index
        @books = Book.where(is_deleted: false)
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
      out = @book.total_quantity - @book.current_quantity  # Calculate borrowed books
  
      if params[:total_quantity].to_i < out
        render json: { message: "Total quantity cannot be less than borrowed books (#{out})" }, status: :unprocessable_entity
      else
        if params[:total_quantity].to_i > @book.total_quantity
          # Increase stock, adjust `current_quantity` accordingly
          new_current_quantity = @book.current_quantity + (params[:total_quantity].to_i - @book.total_quantity)
        else
          # Reduce stock, ensuring `current_quantity` never goes below borrowed books
          new_current_quantity = params[:total_quantity].to_i - out
        end
  
        if @book.update(book_params.merge(current_quantity: new_current_quantity))
          render json: { message: "Book updated successfully", book: @book }, status: :ok
        else
          render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
        end
      end
    else
      render json: { error: "Book not found" }, status: :not_found
    end
  end
  

  def destroy
    @book = Book.find_by(id: params[:id])
  
    if @book.nil?
      return render json: { error: "Book not found" }, status: :not_found
    end
  
    if Borrow.where(book_id: @book.id, returned_on: nil).exists?
      return render json: { error: "Book cannot be deleted. It is currently borrowed!" }, status: :forbidden
    end
  
    if @book.update(is_deleted: true)
      render json: { message: "Book deleted successfully!" }, status: :ok
    else
      render json: { error: "Failed to delete book" }, status: :unprocessable_entity
    end
  end
  


    def book_params
        params.require(:book).permit(:title, :author, :publication_date, :genre, :availability_status, :current_quantity, :total_quantity, :isbn, :price)
    end
end
