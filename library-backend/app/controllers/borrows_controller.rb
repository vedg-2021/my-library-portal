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

    def borrow_params
        params.require(:borrow).permit(:book_id, :user_id, :borrowed_on, :returned_on)
    end
end
