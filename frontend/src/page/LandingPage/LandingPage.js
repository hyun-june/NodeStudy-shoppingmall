import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";

const LandingPage = () => {
  const dispatch = useDispatch();

  const { productList, totalPageNum, loading } = useSelector(
    (state) => state.product
  );
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체
  const name = query.get("name");

  useEffect(() => {
    setSearchQuery({
      page: query.get("page") || 1,
      name: query.get("name") || "",
    });
  }, [query]);

  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [searchQuery, dispatch]);

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };
  return (
    <Container>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row>
            {productList.length > 0 ? (
              productList.map((item) => (
                <Col md={3} sm={12} key={item._id}>
                  <ProductCard item={item} />
                </Col>
              ))
            ) : (
              <div className="text-align-center empty-bag">
                {searchQuery.name === "" ? (
                  <h2>등록된 상품이 없습니다!</h2>
                ) : (
                  <h2>{searchQuery.name}과 일치한 상품이 없습니다!</h2>
                )}
              </div>
            )}
          </Row>
          {/* <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPageNum}
            forcePage={searchQuery.page - 1}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            className="display-center list-style-none"
          /> */}
        </>
      )}
    </Container>
  );
};

export default LandingPage;
