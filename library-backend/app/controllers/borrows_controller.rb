class BorrowsController < ApplicationController
    def borrow
        logger.debug "Params: #{borrow_params.inspect}"

        @borrow = Borrow.new(borrow_params)
        if @borrow.save
            # Update the book's availability_status to false after successful borrow
            # @borrow.book.update(availability_status: false)
            if @borrow.book.availability_status && @borrow.book.current_quantity > 0
                # @borrow.book.update(current_quantity: @borrow.book.current_quantity - 1)
                render json: {message: "Request Generated!", borrow: @borrow, book: @borrow.book}, status: :created
            else
                render json: {message: "Book Unavailable!"}, status: :unprocessable_entity
            end
        else
            render json: {errors: @borrow.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def index
        @borrows = Borrow.all
        render json: @borrows, include: [:book, :user], status: :ok
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
            old_records = Borrow.where(
                user_id: @user.id,
                request_is_approved: true,
                return_is_approved: true
            ).where.not(borrowed_on: nil, returned_on: nil)
        
            # Fetch pending records where borrowed_on is set, but returned_on is NULL and approvals are false
            pending_records = Borrow.where(
                user_id: @user.id,
                returned_on: nil,
                request_is_approved: true,
                return_is_approved: false
            ).where.not(borrowed_on: nil)

            # Combine both sets of records
            @borrows = old_records.or(pending_records).includes(:book)
        
            
            # Log the borrowing history for debugging purposes
            logger.debug "User ID: #{@user.id}, Borrowing History: #{@borrows.inspect}"
            
            # Check if there are any borrow records
            if @borrows.exists?
                render json: @borrows, include: [:book, :user] # Include book details if available
            else
                render json: { message: "No borrowing history available" }, status: :not_found
            end
        else
            render json: { error: "User not found" }, status: :not_found
        end
    end

    def return_book
        # Return the borrowed book and also update the book's availability_status to true
        @borrow = Borrow.find_by(book_id: params[:book_id], user_id: params[:user_id], returned_on: nil)
        if @borrow
            @borrow.update(returned_on: Date.today)
            # @borrow.book.update(availability_status: true)
            # @borrow.book.update(current_quantity: @borrow.book.current_quantity + 1)
            render json: {message: "Return Request Createad!", borrow: @borrow}, status: :ok
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
    
    def showpending
        @all = Borrow.where(request_is_approved: false)
        if @all
            render json: @all, include: [:book, :user], status: :ok
        end
    end

    def showpendingreturns
        @all = Borrow.where.not(returned_on: nil).where(return_is_approved: false)
        if @all
            render json: @all, include: [:book, :user], status: :ok
        end
    end

    def approveborrow
        logger.debug "Params: #{borrow_params.inspect}"

        @borrow = Borrow.find_by(id: params[:recordid])
        if @borrow
            # Update the book's availability_status to false after successful borrow
            # @borrow.book.update(availability_status: false)
            if @borrow.book.availability_status 
                @borrow.book.update(current_quantity: @borrow.book.current_quantity - 1)
                @borrow.update(request_is_approved: true, borrowed_on: Date.today)
            end

            if @borrow.book.current_quantity == 0
                @borrow.book.update(availability_status: false)
            end

            render json: {message: "Borrow Approved!", borrow: @borrow, book: @borrow.book}, status: :created
        else
            render json: {errors: @borrow.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def approvereturn
        logger.debug "Params: #{borrow_params.inspect}"

        @borrow = Borrow.find_by(id: params[:recordid])
        if @borrow
            @borrow.update(returned_on: Date.today, return_is_approved: true)
            @borrow.book.update(availability_status: true)
            @borrow.book.update(current_quantity: @borrow.book.current_quantity + 1)
            render json: {message: "Book returned successfully", borrow: @borrow}, status: :ok
        else
            render json: {error: "Book not found"}, status: :not_found
        end
    end

    def destroy
        logger.debug "Params: #{params.inspect}"
        @borrow = Borrow.find_by(id: params[:id])
    
        if @borrow.nil?
            return render json: { error: "Borrow record not found" }, status: :not_found
        else
            @borrow.destroy
            render json: { message: "Borrow record deleted successfully" }, status: :ok
        end
    end

    private

    
    def borrow_params
        params.require(:borrow).permit(:recordid, :book_id, :user_id, :borrowed_on, :returned_on, :request_is_approved)
    end
end
