class Book < ApplicationRecord
    validates :title, presence: true, uniqueness: true
    has_many :borrows
    has_many :users, through: :borrows
    class Book < ApplicationRecord
        validates :isbn, uniqueness: true, presence: true
        validates :price, numericality: { greater_than_or_equal_to: 0 }
      end      
end
