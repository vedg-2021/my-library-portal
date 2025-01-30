class ChangeDefaultForBorrowedOnAndReturnedOn < ActiveRecord::Migration[8.0]
  def change
    change_column_default :borrows, :borrowed_on, nil
    change_column_default :borrows, :returned_on, nil
  end
end
