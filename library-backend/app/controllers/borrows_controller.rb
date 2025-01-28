class BorrowsController < ApplicationController
    def borrow
        logger.debug "Params: #{borrow_params.inspect}"

        @borrow = Borrow.new(borrow_params)
        if @borrow.save
            # Update the book's availability_status to false after successful borrow
            @borrow.book.update(availability_status: false)
            render json: {message: "Borrowed!", borrow: @borrow, book: @borrow.book}, status: :created
        else
            render json: {errors: @borrow.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def index
        @borrows = Borrow.all
        render json: @borrows
    end

    def show
        @borrow = Borrow.where(user_id: params[:id])
        if @borrow
            render json: @borrow
        else
            render json: {error: "Borrow not found"}, status: :not_found
        end

    end

    def viewall
        # Fetch the user
        @user = User.find_by(id: params[:id])
        
        if @user
            # Fetch borrowing history for the specific user
            @borrows = Borrow.where(user_id: @user.id).includes(:book) # Assuming each borrow is associated with a book
            
            # Log the borrowing history for debugging purposes
            logger.debug "User ID: #{@user.id}, Borrowing History: #{@borrows.inspect}"
            
            # Check if there are any borrow records
            if @borrows.exists?
                render json: @borrows, include: :book # Include book details if available
            else
                render json: { message: "No borrowing history available" }, status: :not_found
            end
        else
            render json: { error: "User not found" }, status: :not_found
        end
    end

    def return_book
        # Return the borrowed book and also update the book's availability_status to true
        borrow = Borrow.find_by(book_id: params[:book_id], user_id: params[:user_id], returned_on: nil)
        if borrow
            borrow.update(returned_on: Date.today)
            borrow.book.update(availability_status: true)
            render json: {message: "Book returned successfully", borrow: borrow}, status: :ok
        else
            render json: {error: "Book not found"}, status: :not_found
        end
    end

    def showall
        @all = Borrow.where(returned_on: nil)
        if @all
            render json: @all, status: :ok
        end
    end

    private

    
    def borrow_params
        params.require(:borrow).permit(:book_id, :user_id, :borrowed_on, :returned_on)
    end
end
