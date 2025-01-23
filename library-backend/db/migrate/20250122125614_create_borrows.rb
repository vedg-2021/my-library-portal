class CreateBorrows < ActiveRecord::Migration[8.0]
  def change
    create_table :borrows do |t|
      t.references :book, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.date :borrowed_on, null: false, default: -> { 'CURRENT_DATE' }
      t.date :returned_on

      t.timestamps
    end
  end
end
