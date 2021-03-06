-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 19-Jun-2018 às 15:58
-- Versão do servidor: 5.7.17-log
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurante`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `caderneta`
--

CREATE TABLE `caderneta` (
  `venda_id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `produto_nome` varchar(50) NOT NULL,
  `preco` float NOT NULL,
  `data` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `caderneta`
--

INSERT INTO `caderneta` (`venda_id`, `produto_id`, `quantidade`, `produto_nome`, `preco`, `data`) VALUES
(1, 1, 2, 'david', 2.5, '2018-06-08T12:08:38.563Z'),
(1, 3, 1, 'Sucos', 2.5, '2018-06-08T12:08:38.563Z'),
(1, 5, 1, 'asd', 2.5, '2018-06-08T11:09:38.563Z'),
(1, 6, 5, 'teste', 12.5, '2018-06-08T11:09:38.563Z'),
(2, 1, 1, 'david', 2.5, '2018-07-08T11:08:38.563Z'),
(2, 5, 5, 'asd', 2.5, '2018-07-08T11:08:38.563Z'),
(2, 6, 5, 'teste', 12.5, '2018-07-08T11:08:38.563Z'),
(2, 8, 1, 'pizza', 2.5, '2018-07-08T11:08:38.563Z'),
(3, 4, 1, 'Sucos', 2.5, '2018-08-08T11:08:38.563Z'),
(3, 5, 1, 'asd', 2.5, '2018-08-08T11:08:38.563Z'),
(3, 9, 1, 'Sucos', 2.5, '2018-08-08T11:08:38.563Z'),
(4, 1, 1, 'Suco Laranja', 2.5, '2018-09-08T11:08:38.563Z'),
(4, 3, 1, 'Suco Manga', 2.5, '2018-09-08T11:08:38.563Z'),
(4, 9, 1, 'Suco Maracuja', 2.5, '2018-09-08T11:08:38.563Z'),
(5, 1, 1, 'Suco Laranja', 2.5, '2018-10-08T11:08:38.563Z'),
(5, 3, 1, 'Suco Manga', 2.5, '2018-10-08T11:08:38.563Z'),
(5, 9, 1, 'Suco Maracuja', 2.5, '2018-10-08T11:08:38.563Z'),
(6, 1, 5, 'Suco Laranja', 2.5, '2018-06-19T15:55:59.541Z');

-- --------------------------------------------------------

--
-- Estrutura da tabela `categoria`
--

CREATE TABLE `categoria` (
  `categoria_id` int(11) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `descricao` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `categoria`
--

INSERT INTO `categoria` (`categoria_id`, `nome`, `descricao`) VALUES
(2, 'Sucos', 'Sucos de diversos sabores '),
(7, 'Teste', 'Sucos de diversos sabores ');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

CREATE TABLE `cliente` (
  `usuario_id` int(11) NOT NULL,
  `nome` varchar(60) DEFAULT NULL,
  `cidade` varchar(60) DEFAULT NULL,
  `bairro` varchar(60) DEFAULT NULL,
  `rua` varchar(60) DEFAULT NULL,
  `complemento` varchar(60) NOT NULL,
  `referencia` varchar(60) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `telefone` int(10) DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`usuario_id`, `nome`, `cidade`, `bairro`, `rua`, `complemento`, `referencia`, `email`, `telefone`, `cpf`) VALUES
(1, 'David Alves', 'juazeiro do norte', 'salesianos', 'alacoque bezerra', '', 'proximo a tv verde vale', 'davidalves101@live.com', 1111111111, '2147483647'),
(2, 'Neymar', 'Barbalha', 'Centro', 'Pero', 'nada', 'nada', 'teste@teste.com', 1111111111, '111111111'),
(3, 'Felipão', 'Cidade', 'Teste', 'uashuashsauh', 'asuhsauhsau', 'teste', 'davidalves101@live.com', 1111111111, '22222222222');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto`
--

CREATE TABLE `produto` (
  `produto_id` int(11) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `descricao` varchar(120) NOT NULL,
  `quantidade` int(5) NOT NULL,
  `categoria_id` int(30) NOT NULL,
  `categoria_nome` varchar(30) NOT NULL,
  `preco` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `produto`
--

INSERT INTO `produto` (`produto_id`, `nome`, `descricao`, `quantidade`, `categoria_id`, `categoria_nome`, `preco`) VALUES
(1, 'Suco Laranja', 'Sucos de diversos sabores ', 20, 2, 'Sucos', 2.5),
(2, 'Suco Morango', '1', 50, 7, 'Teste', 2.5),
(3, 'Suco Manga', 'Sucos de diversos sabores ', 30, 7, 'Teste', 2.5),
(4, 'Suco Limão', 'Sucos de diversos sabores ', 20, 7, 'Teste', 2.5),
(5, 'Suco Tangirina', 'asd', 50, 7, 'Teste', 2.5),
(6, 'Suco Graviola', 'asdqwee', 10, 7, 'Teste', 2.5),
(8, 'Suco Melão', 'pizza', 25, 7, 'Teste', 2.5),
(9, 'Suco Maracuja', 'Sucos de diversos sabores ', 30, 2, 'Sucos', 2.5),
(10, 'Suco Beterraba', 'Teste de categoria', 80, 7, 'Teste', 2.5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `venda`
--

CREATE TABLE `venda` (
  `venda_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `data` varchar(30) NOT NULL,
  `pagamento` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `venda`
--

INSERT INTO `venda` (`venda_id`, `usuario_id`, `data`, `pagamento`) VALUES
(1, 1, '2018-06-09T11:08:38.563Z', 'Sim'),
(2, 1, '2018-06-08T11:08:38.563Z', 'Sim'),
(3, 1, '2018-06-08T12:41:31.000Z', 'nao'),
(4, 1, '2018-06-08T15:08:19.867Z', 'nao'),
(5, 2, '2018-06-08T15:08:33.560Z', 'nao'),
(6, 1, '2018-06-19T15:33:55.718Z', 'Nao'),
(7, 1, '2018-06-19T15:38:54.082Z', 'Nao');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `caderneta`
--
ALTER TABLE `caderneta`
  ADD PRIMARY KEY (`venda_id`,`produto_id`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`categoria_id`);

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`usuario_id`);

--
-- Indexes for table `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`produto_id`);

--
-- Indexes for table `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`venda_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `categoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `produto`
--
ALTER TABLE `produto`
  MODIFY `produto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `venda`
--
ALTER TABLE `venda`
  MODIFY `venda_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
