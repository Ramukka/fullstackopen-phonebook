const Filter = ({filterStr, handleFilter}) => {
    return (
        <div>
        filter shown with: <input value={filterStr} onChange={handleFilter} />
      </div>
    )
}

export default Filter